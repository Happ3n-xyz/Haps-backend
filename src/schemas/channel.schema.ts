import Joi from "joi";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../utils/constants";

const core = Joi.array().items(
    Joi.string()
    .equal(
        'Architecture',
        'NFT Artist',
        'Community Builder',
        'Creator',
        'Crypto Spot',
        'DAOs',
        'Protocol',
        'Development',
        'Education',
        'Entertainment',
        'Finance',
        'Legal',
        'Storyteller',
        'Trading',
        'VideoGames',
        'Angel',
    )
);

const socialItem = Joi.object({
    name: Joi.string().required(),
    url: Joi.string().required(),
});

const social = Joi.array().items(socialItem);


export const getUserChannels = Joi.object({
    userId: Joi.string().required()
});

export const getChannel = Joi.object({
    id: Joi.string().required()
});

export const getAllChannels = Joi.object({
    page: Joi.number().optional().default(DEFAULT_PAGE),
    pageSize: Joi.number().optional().default(DEFAULT_PAGE_SIZE)
});

export const updateChannel = Joi.object({
    name: Joi.string().optional(),
    about: Joi.string().optional(),
    country: Joi.string().optional(),
    core: core.optional(),
    social: social.optional(),
});

export const createChannel = Joi.object({
    name: Joi.string().required(),
    about: Joi.string().required(),
    country: Joi.string().required(),
    core: core.required(),
    social: social.required(),
});


