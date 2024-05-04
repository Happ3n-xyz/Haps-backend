import joi from "joi";
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from "../utils/constants";

export const getHap = joi.object({
    id: joi.string().uuid().required()
});

export const basicPaginationHaps = joi.object({
    page: joi.number().default(DEFAULT_PAGE),
    pageSize: joi.number().default(DEFAULT_PAGE_SIZE)
});

export const createHap = joi.object({
    tokenId: joi.string().required(),
    ipfsHash: joi.string().required(),
    nftImage: joi.string().required(),
    eventName: joi.string().required(),
    eventDate: joi.string().isoDate().required(),
    chain: joi.string().equal('celo', 'rari', 'optimism', 'arbitrum').required(),
    secretWord: joi.string().max(15).required(),
    message: joi.string().max(255).required(),
});

export const updateHap = joi.object({
    eventName: joi.string().optional(),
    eventDate: joi.string().isoDate().optional(),
    secretWord: joi.string().max(15).optional(),
    message: joi.string().max(255).optional(),
});

export const claimHap = joi.object({
    secretWord: joi.string().max(15).required(),
    id: joi.string().uuid().required()
});

export const getHapDetails = joi.object({
    token: joi.string().optional(),
});