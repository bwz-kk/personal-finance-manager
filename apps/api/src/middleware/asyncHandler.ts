import type { NextFunction, Request, Response } from 'express'

type AsyncRouteHandler = (req: Request, res: Response) => Promise<void>

/** Express 4 doesn't forward rejected promises to the error handler on its
 * own — this wrapper does that so controllers can stay plain async functions. */
export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res).catch(next)
  }
}
