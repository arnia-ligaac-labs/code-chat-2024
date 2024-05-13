import "dotenv/config";
import { app } from "./express";

app.listen(process.env.PORT, () => {
  console.log(`Server is runnings on http://localhost:${process.env.PORT}`);
  console.log(
    `Registered routes: [${app._router.stack
      .filter((r: any) => r.route)
      .map((r: any) => `"${r.route.path}"`)}]`
  );
});
