import { SessionRepository } from "../repositories/session.repository";
import { Request, Response } from "express";
import { handleErrors } from "../utils";

export class SessionController {
  private sessionRepository: SessionRepository;

  constructor() {
    this.sessionRepository = new SessionRepository();
  }

  public async getSession(_: Request, res: Response) {
    try {
      const data = await this.sessionRepository.getSession();
      return res.status(200).json(data);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }

  public async refreshSession(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refresh_token;
      if (!refreshToken) {
        return res.status(400).json({ error: "Refresh token is required" });
      }
      const data = await this.sessionRepository.refreshSession(refreshToken);
      return res.status(200).json(data);
    } catch (error: unknown) {
      return handleErrors(error, res);
    }
  }
}
