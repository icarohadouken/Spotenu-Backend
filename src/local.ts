import { app } from "./index";
import { AddressInfo } from "net";

const server = app.listen(process.env.PORT || 3006, () => {
    if (server) {
        const address = server.address() as AddressInfo
        console.log(`Server is runing in http://localhost:${address.port}`)
    } else {
        console.error(`Server Failure`)
    }
})