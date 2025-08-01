import { createServer } from "./server";
import { config } from "./infrastructure/config/env";

const app = createServer();

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});

