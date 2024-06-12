"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = require("./express");
express_1.app.listen(process.env.PORT, () => {
    console.log(`Server is runnings on http://localhost:${process.env.PORT}`);
    console.log(`Registered routes: [${express_1.app._router.stack
        .filter((r) => r.route)
        .map((r) => `"${r.route.path}"`)}]`);
});
//# sourceMappingURL=server.js.map