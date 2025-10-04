const {Joi, celebrate } = require('celebrate');
const validator = require('validator');

const validateUrl = (value, helpers) => {
    if (validator.isURL(value)) {
        return value;
    }
    return helpers.error('string.uri');
};

const validateEmail = (value, helpers) => {
    if (validator.isEmail(value)) {
        return value;
    }
    return helpers.error('string.email');
};

module.exports.validateCardBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30).messages({
          'string.min': 'Name must be at least 2 characters long',
          'string.max': 'Name must be less than 30 characters long',
          'string.empty': 'Name is required',
        }),
        imageUrl: Joi.string().required().custom(validateUrl).messages({
          'string.uri': 'Invalid image URL',
          'string.empty': 'Image URL is required',
        }),
        weather: Joi.string().valid('hot', 'warm', 'cold').required().messages({
          'any.required': 'The weather field must be filled in',
        }),
    }),
});

module.exports.validateInfoBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30).messages({
          'string.min': 'Name must be at least 2 characters long',
          'string.max': 'Name must be less than 30 characters long',
          'string.empty': 'Name is required',
        }),
        avatar: Joi.string().required().custom(validateUrl).messages({
          'string.uri': 'Invalid avatar URL',
          'string.empty': 'Avatar URL is required',
        }),
        email: Joi.string().required().custom(validateEmail).messages({
          'string.email': 'Invalid email',
          'string.empty': 'Email is required',
        }),
        password: Joi.string().required().messages({
          'string.empty': 'Password is required',
        }),
    }),
});

module.exports.validateUserBody = celebrate({
    body: Joi.object().keys({
        email: Joi.string().required().custom(validateEmail).messages({
          'string.email': 'Invalid email',
          'string.empty': 'Email is required',
        }),
        password: Joi.string().required().messages({
          'string.empty': 'Password is required',
        }),
    }),
});

module.exports.validateCardId = celebrate({
    params: Joi.object().keys({
        itemId: Joi.string().required().min(24).messages({
          'string.min': 'Minimum length is 24 characters',
          'string.empty': 'User ID is required',
        }),
    }),
});

module.exports.validateProfileBody = celebrate({
    body: Joi.object().keys({
        name: Joi.string().required().min(2).max(30).messages({
          'string.min': 'Name must be at least 2 characters long',
          'string.max': 'Name must be less than 30 characters long',
          'string.empty': 'Name is required',
        }),
        avatar: Joi.string().required().custom(validateUrl).messages({
          'string.uri': 'Invalid avatar URL',
          'string.empty': 'Avatar URL is required',
        }),
    }),
});
