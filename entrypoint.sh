#!/bin/sh

# Re-create env-config.js with runtime environment variables
echo "window.__ENV = {" > ./public/env-config.js
echo "  NEXT_PUBLIC_API_URL: \"$NEXT_PUBLIC_API_URL\"," >> ./public/env-config.js
echo "  NEXT_PUBLIC_WHATSAPP_NUMBER: \"$NEXT_PUBLIC_WHATSAPP_NUMBER\"," >> ./public/env-config.js
echo "};" >> ./public/env-config.js

# Execute the CMD
exec "$@"
