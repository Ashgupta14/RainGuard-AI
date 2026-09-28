import type {
  GridCell,
  WeatherGrid,
} from "./gridTypes";


/*
 * ---------------------------------------------------------
 * TYPES
 * ---------------------------------------------------------
 */

export interface GridKinematics {

  windConvergence?: number;

  windShear?: number;

}


interface WindVector {

  u: number;

  v: number;

}


/*
 * ---------------------------------------------------------
 * CONSTANTS
 * ---------------------------------------------------------
 *
 * Approximate Earth radius conversion.
 *
 * Latitude:
 *   1 degree ≈ 111,320 metres
 *
 * Longitude:
 *   depends on latitude.
 * ---------------------------------------------------------
 */

const METERS_PER_DEGREE_LATITUDE =
  111_320;


/*
 * ---------------------------------------------------------
 * WIND DIRECTION → VECTOR
 * ---------------------------------------------------------
 *
 * Meteorological convention:
 *
 * 0°   = wind FROM north
 * 90°  = wind FROM east
 * 180° = wind FROM south
 * 270° = wind FROM west
 *
 * We convert it into the direction the air is moving.
 * ---------------------------------------------------------
 */

function windToVector(
  speed: number,
  direction: number
): WindVector {

  const radians =
    direction *
    Math.PI /
    180;


  /*
   * Meteorological wind direction describes
   * where the wind comes FROM.
   *
   * Therefore we reverse the vector.
   */

  const u =
    -speed *
    Math.sin(
      radians
    );


  const v =
    -speed *
    Math.cos(
      radians
    );


  return {
    u,
    v,
  };

}


/*
 * ---------------------------------------------------------
 * LONGITUDE DISTANCE
 * ---------------------------------------------------------
 */

function longitudeDistance(
  latitude: number,
  longitudeDifference: number
): number {

  const latitudeRadians =
    latitude *
    Math.PI /
    180;


  return (
    longitudeDifference *
    METERS_PER_DEGREE_LATITUDE *
    Math.cos(
      latitudeRadians
    )
  );

}


/*
 * ---------------------------------------------------------
 * LATITUDE DISTANCE
 * ---------------------------------------------------------
 */

function latitudeDistance(
  latitudeDifference: number
): number {

  return (
    latitudeDifference *
    METERS_PER_DEGREE_LATITUDE
  );

}


/*
 * ---------------------------------------------------------
 * GET GRID INDEX
 * ---------------------------------------------------------
 */

function getCellIndex(
  row: number,
  column: number,
  columns: number
): number {

  return (
    row *
    columns +
    column
  );

}


/*
 * ---------------------------------------------------------
 * GET WIND VECTOR
 * ---------------------------------------------------------
 */

function getWindVector(
  cell: GridCell
): WindVector | null {

  if (
    cell.windSpeed ===
      undefined ||
    cell.windDirection ===
      undefined
  ) {

    return null;

  }


  return windToVector(
    cell.windSpeed,
    cell.windDirection
  );

}


/*
 * ---------------------------------------------------------
 * CALCULATE CENTRAL DERIVATIVE
 * ---------------------------------------------------------
 */

function centralDerivative(
  positiveValue: number,
  negativeValue: number,
  distance: number
): number {

  if (
    distance <= 0
  ) {

    return 0;

  }


  return (
    positiveValue -
    negativeValue
  ) /
  distance;

}


/*
 * ---------------------------------------------------------
 * CALCULATE CELL KINEMATICS
 * ---------------------------------------------------------
 */

function calculateCellKinematics(
  grid: WeatherGrid,
  row: number,
  column: number
): GridKinematics {

  const centerIndex =
    getCellIndex(
      row,
      column,
      grid.columns
    );


  const centerCell =
    grid.cells[
      centerIndex
    ];


  const centerWind =
    getWindVector(
      centerCell
    );


  /*
   * No wind information.
   */

  if (
    centerWind ===
    null
  ) {

    return {};

  }


  /*
   * -------------------------------------------------------
   * NEIGHBOURS
   * -------------------------------------------------------
   */

  const leftCell =
    column > 0
      ? grid.cells[
          getCellIndex(
            row,
            column - 1,
            grid.columns
          )
        ]
      : undefined;


  const rightCell =
    column <
    grid.columns - 1
      ? grid.cells[
          getCellIndex(
            row,
            column + 1,
            grid.columns
          )
        ]
      : undefined;


  const bottomCell =
    row > 0
      ? grid.cells[
          getCellIndex(
            row - 1,
            column,
            grid.columns
          )
        ]
      : undefined;


  const topCell =
    row <
    grid.rows - 1
      ? grid.cells[
          getCellIndex(
            row + 1,
            column,
            grid.columns
          )
        ]
      : undefined;


  const leftWind =
    leftCell
      ? getWindVector(
          leftCell
        )
      : null;


  const rightWind =
    rightCell
      ? getWindVector(
          rightCell
        )
      : null;


  const bottomWind =
    bottomCell
      ? getWindVector(
          bottomCell
        )
      : null;


  const topWind =
    topCell
      ? getWindVector(
          topCell
        )
      : null;


  /*
   * -------------------------------------------------------
   * GRID SPACING
   * -------------------------------------------------------
   */

  const dx =
    rightCell &&
    leftCell

      ? longitudeDistance(
          centerCell.centerLatitude,
          rightCell.centerLongitude -
            leftCell.centerLongitude
        )

      : rightCell

      ? longitudeDistance(
          centerCell.centerLatitude,
          rightCell.centerLongitude -
            centerCell.centerLongitude
        )

      : leftCell

      ? longitudeDistance(
          centerCell.centerLatitude,
          centerCell.centerLongitude -
            leftCell.centerLongitude
        )

      : 0;


  const dy =
    topCell &&
    bottomCell

      ? latitudeDistance(
          topCell.centerLatitude -
            bottomCell.centerLatitude
        )

      : topCell

      ? latitudeDistance(
          topCell.centerLatitude -
            centerCell.centerLatitude
        )

      : bottomCell

      ? latitudeDistance(
          centerCell.centerLatitude -
            bottomCell.centerLatitude
        )

      : 0;


  /*
   * -------------------------------------------------------
   * DERIVATIVES
   * -------------------------------------------------------
   */

  let duDx = 0;

  let dvDx = 0;

  let duDy = 0;

  let dvDy = 0;


  /*
   * East-west derivatives.
   */

  if (
    rightWind &&
    leftWind &&
    dx > 0
  ) {

    duDx =
      centralDerivative(
        rightWind.u,
        leftWind.u,
        dx
      );


    dvDx =
      centralDerivative(
        rightWind.v,
        leftWind.v,
        dx
      );

  } else if (
    rightWind &&
    dx > 0
  ) {

    duDx =
      centralDerivative(
        rightWind.u,
        centerWind.u,
        dx
      );


    dvDx =
      centralDerivative(
        rightWind.v,
        centerWind.v,
        dx
      );

  } else if (
    leftWind &&
    dx > 0
  ) {

    duDx =
      centralDerivative(
        centerWind.u,
        leftWind.u,
        dx
      );


    dvDx =
      centralDerivative(
        centerWind.v,
        leftWind.v,
        dx
      );

  }


  /*
   * North-south derivatives.
   */

  if (
    topWind &&
    bottomWind &&
    dy > 0
  ) {

    duDy =
      centralDerivative(
        topWind.u,
        bottomWind.u,
        dy
      );


    dvDy =
      centralDerivative(
        topWind.v,
        bottomWind.v,
        dy
      );

  } else if (
    topWind &&
    dy > 0
  ) {

    duDy =
      centralDerivative(
        topWind.u,
        centerWind.u,
        dy
      );


    dvDy =
      centralDerivative(
        topWind.v,
        centerWind.v,
        dy
      );

  } else if (
    bottomWind &&
    dy > 0
  ) {

    duDy =
      centralDerivative(
        centerWind.u,
        bottomWind.u,
        dy
      );


    dvDy =
      centralDerivative(
        centerWind.v,
        bottomWind.v,
        dy
      );

  }


  /*
   * -------------------------------------------------------
   * HORIZONTAL DIVERGENCE
   * -------------------------------------------------------
   *
   * divergence =
   *
   * du/dx + dv/dy
   *
   * Units:
   *   s⁻¹
   */

  const divergence =
    duDx +
    dvDy;


  /*
   * -------------------------------------------------------
   * HORIZONTAL CONVERGENCE
   * -------------------------------------------------------
   *
   * convergence =
   *   -divergence
   *
   * Positive values indicate
   * horizontal convergence.
   */

  const convergence =
    -divergence;


  /*
   * -------------------------------------------------------
   * LOCAL WIND SHEAR / GRADIENT
   * -------------------------------------------------------
   *
   * Magnitude of the horizontal
   * wind-gradient tensor.
   */

  const shear =
    Math.sqrt(
      (
        duDx *
        duDx
      ) +
      (
        dvDx *
        dvDx
      ) +
      (
        duDy *
        duDy
      ) +
      (
        dvDy *
        dvDy
      )
    );


  return {

    windConvergence:
      Number(
        convergence.toFixed(
          6
        )
      ),

    windShear:
      Number(
        shear.toFixed(
          6
        )
      ),

  };

}


/*
 * ---------------------------------------------------------
 * ENRICH GRID WITH KINEMATICS
 * ---------------------------------------------------------
 */

export function calculateGridKinematics(
  grid: WeatherGrid
): WeatherGrid {

  const cells =
    grid.cells.map(
      (
        cell,
        index
      ) => {

        const row =
          Math.floor(
            index /
            grid.columns
          );


        const column =
          index %
          grid.columns;


        const kinematics =
          calculateCellKinematics(
            grid,
            row,
            column
          );


        return {

          ...cell,

          ...kinematics,

        };

      }
    );


  return {

    ...grid,

    cells,

  };

}
