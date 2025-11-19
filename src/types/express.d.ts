import "express-serve-static-core";

declare global {
  namespace Express {
    interface UserInfo {
      id: string;
    }

    interface Request {
      user?: UserInfo;
    }
  }

  module "swagger-ui-express";
  module "swagger-jsdoc";
}

export {};
