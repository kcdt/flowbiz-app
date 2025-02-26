import { Response } from "express";

const APIResponse = (response: Response, data: any, message: string, status = 200) => {
    response.status(status).json({ data, message });
}

export default APIResponse;