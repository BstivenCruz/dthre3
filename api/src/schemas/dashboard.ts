import joi from "joi";

const idSchema = joi.object({
  userId: joi.string().required(),
});

export { idSchema };