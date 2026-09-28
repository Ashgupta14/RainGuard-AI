import type {
  GridCell,
  WeatherGrid,
  WeatherObservation,
} from "./gridTypes";

interface GridConfig {
  minLatitude: number;
  maxLatitude: number;

  minLongitude: number;
  maxLongitude: number;

  rows: number;
  columns: number;
}


/*
 * ---------------------------------------------------------
 * HELPER
 * ---------------------------------------------------------
 */

function average(
  values: number[]
): number | undefined {
  if (values.length === 0) {
    return undefined;
  }

  return (
    values.reduce(
      (sum, value) => sum + value,
      0
    ) / values.length
  );
}


/*
 * ---------------------------------------------------------
 * FIND CELL
 * ---------------------------------------------------------
 */

function findCell(
  observation: WeatherObservation,
  config: GridConfig
): {
  row: number;
  column: number;
} | null {

  const latitudeRange =
    config.maxLatitude -
    config.minLatitude;

  const longitudeRange =
    config.maxLongitude -
    config.minLongitude;

  if (
    observation.latitude <
      config.minLatitude ||
    observation.latitude >
      config.maxLatitude ||
    observation.longitude <
      config.minLongitude ||
    observation.longitude >
      config.maxLongitude
  ) {
    return null;
  }

  const latitudePosition =
    (observation.latitude -
      config.minLatitude) /
    latitudeRange;

  const longitudePosition =
    (observation.longitude -
      config.minLongitude) /
    longitudeRange;

  let row = Math.floor(
    latitudePosition *
      config.rows
  );

  let column = Math.floor(
    longitudePosition *
      config.columns
  );

  /*
   * Handle observations exactly on the
   * maximum boundary.
   */

  if (row >= config.rows) {
    row = config.rows - 1;
  }

  if (column >= config.columns) {
    column =
      config.columns - 1;
  }

  return {
    row,
    column,
  };
}


/*
 * ---------------------------------------------------------
 * CREATE EMPTY GRID
 * ---------------------------------------------------------
 */

function createEmptyGrid(
  config: GridConfig
): GridCell[] {

  const cells: GridCell[] = [];

  const latitudeStep =
    (config.maxLatitude -
      config.minLatitude) /
    config.rows;

  const longitudeStep =
    (config.maxLongitude -
      config.minLongitude) /
    config.columns;

  for (
    let row = 0;
    row < config.rows;
    row++
  ) {

    for (
      let column = 0;
      column < config.columns;
      column++
    ) {

      const minLatitude =
        config.minLatitude +
        row * latitudeStep;

      const maxLatitude =
        minLatitude +
        latitudeStep;

      const minLongitude =
        config.minLongitude +
        column * longitudeStep;

      const maxLongitude =
        minLongitude +
        longitudeStep;

      cells.push({
        id:
          `grid-${row}-${column}`,

        minLatitude,
        maxLatitude,

        minLongitude,
        maxLongitude,

        centerLatitude:
          (minLatitude +
            maxLatitude) /
          2,

        centerLongitude:
          (minLongitude +
            maxLongitude) /
          2,

        observationCount: 0,
      });
    }
  }

  return cells;
}


/*
 * ---------------------------------------------------------
 * FUSE OBSERVATIONS
 * ---------------------------------------------------------
 */

export function createWeatherGrid(
  observations: WeatherObservation[],
  config: GridConfig
): WeatherGrid {

  const cells =
    createEmptyGrid(config);

  /*
   * Store observations temporarily
   * by spatial cell.
   */

  const observationsByCell =
    new Map<
      string,
      WeatherObservation[]
    >();

  for (
    const observation of observations
  ) {

    const position =
      findCell(
        observation,
        config
      );

    if (!position) {
      continue;
    }

    const cellId =
      `grid-${position.row}-${position.column}`;

    const existing =
      observationsByCell.get(
        cellId
      ) ?? [];

    existing.push(
      observation
    );

    observationsByCell.set(
      cellId,
      existing
    );
  }


  /*
   * Calculate fused values for each cell.
   */

  const fusedCells =
    cells.map((cell) => {

      const observationsInCell =
        observationsByCell.get(
          cell.id
        ) ?? [];

      /*
       * Surface observations
       */

      const temperature =
        average(
          observationsInCell
            .map(
              (item) =>
                item.temperature
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      const humidity =
        average(
          observationsInCell
            .map(
              (item) =>
                item.humidity
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      const pressure =
        average(
          observationsInCell
            .map(
              (item) =>
                item.pressure
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      const rainfall =
        average(
          observationsInCell
            .map(
              (item) =>
                item.rainfall
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      const windSpeed =
        average(
          observationsInCell
            .map(
              (item) =>
                item.windSpeed
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      const windDirection =
        average(
          observationsInCell
            .map(
              (item) =>
                item.windDirection
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      /*
       * Atmospheric model variables
       */

      const integratedWaterVapour =
        average(
          observationsInCell
            .map(
              (item) =>
                item.integratedWaterVapour
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      const cape =
        average(
          observationsInCell
            .map(
              (item) =>
                item.cape
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      const cin =
        average(
          observationsInCell
            .map(
              (item) =>
                item.cin
            )
            .filter(
              (
                value
              ): value is number =>
                value !==
                undefined
            )
        );

      return {
        ...cell,

        observationCount:
          observationsInCell.length,

        temperature,

        humidity,

        pressure,

        rainfall,

        windSpeed,

        windDirection,

        /*
         * Atmospheric intelligence
         */

        integratedWaterVapour,

        cape,

        cin,
      };
    });


  return {
    rows:
      config.rows,

    columns:
      config.columns,

    minLatitude:
      config.minLatitude,

    maxLatitude:
      config.maxLatitude,

    minLongitude:
      config.minLongitude,

    maxLongitude:
      config.maxLongitude,

    cells:
      fusedCells,
  };
}