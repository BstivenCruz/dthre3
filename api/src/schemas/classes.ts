import joi from "joi";


const upsertSchema = joi.object({
    id: joi.string().uuid().optional(),
    name: joi.string().trim().min(1).max(100).required()
        .messages({
            'string.empty': 'El nombre de la clase es obligatorio',
            'string.min': 'El nombre debe tener al menos 1 carácter',
            'string.max': 'El nombre no puede exceder 100 caracteres'
        }),

    styleId: joi.string().uuid().required()
        .messages({
            'string.empty': 'El estilo de baile es obligatorio',
            'string.guid': 'El ID del estilo debe ser un UUID válido'
        }),

    description: joi.string().trim().max(500).allow(null, '').optional(),
    teacherId: joi.string().uuid().allow(null).optional(),
    roomId: joi.string().uuid().allow(null).optional(),
    level: joi.string().valid('iniciacion', 'intermedio', 'avanzado', 'open')
        .default('iniciacion'),
    creditCost: joi.number().integer().min(0).default(1),
    maxCapacity: joi.number().integer().min(1).max(100).default(20),
    isSpecial: joi.boolean().default(false),
    isActive: joi.boolean().default(true),
    color: joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#3B82F6')
        .messages({
            'string.pattern.base': 'El color debe ser un código hexadecimal válido (ej: #3B82F6)'
        }),

    schedules: joi.array().items(
        joi.object({
            id: joi.string().uuid().optional(),
            dayOfWeek: joi.number().integer().min(0).max(6).required()
                .messages({
                    'number.base': 'El día de la semana debe ser un número',
                    'number.min': 'El día debe estar entre 0 (Domingo) y 6 (Sábado)',
                    'number.max': 'El día debe estar entre 0 (Domingo) y 6 (Sábado)'
                }),
            startTime: joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).required()
                .messages({
                    'string.pattern.base': 'La hora de inicio debe tener formato HH:MM (ej: 18:00)'
                }),
            endTime: joi.string().pattern(/^([0-1][0-9]|2[0-3]):[0-5][0-9]$/).required()
                .messages({
                    'string.pattern.base': 'La hora de fin debe tener formato HH:MM (ej: 19:30)'
                }),
            isActive: joi.boolean().default(true)
        })
    ).min(1).default([])
        .messages({
            'array.min': 'Debe agregar al menos un horario para la clase'
        })
});

export { upsertSchema };