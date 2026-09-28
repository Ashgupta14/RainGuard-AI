import urllib.parse
from backend.app.main import fastapi_app

async def app(scope, receive, send):
    if scope["type"] in ("http", "websocket"):
        # Extract the original path from the query string parameter '__vercel_path'
        query_string = scope.get("query_string", b"").decode("utf-8")
        query_params = urllib.parse.parse_qs(query_string, keep_blank_values=True)
        
        vercel_path = query_params.get("__vercel_path", [None])[0]
        
        if vercel_path is not None:
            # Reconstruct the original path
            scope["path"] = f"/api/{vercel_path}"
            
            # Remove the __vercel_path parameter from the query string so it doesn't pollute FastAPI
            query_params.pop("__vercel_path")
            
            # Reconstruct the query string
            new_query = urllib.parse.urlencode(query_params, doseq=True)
            scope["query_string"] = new_query.encode("utf-8")
            
    await fastapi_app(scope, receive, send)

