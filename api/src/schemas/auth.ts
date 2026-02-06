import joi from "joi";

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
});

const registerSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required(),
  nombres: joi.string().required(),
  apellidos: joi.string().required(),
  telefono: joi.string().required(),
});

const idSchema = joi.object({
  userId: joi.string().required(),
});

export { loginSchema, registerSchema, idSchema };
