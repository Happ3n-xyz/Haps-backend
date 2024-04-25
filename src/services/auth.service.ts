import { config } from '../config/config';
import { generateRandomUsername } from '../utils/random';
import UserService from './user.service';
import jwt from 'jsonwebtoken';
import { verifyMessage } from 'ethers';
import boom from '@hapi/boom';

export default class AuthService {

    private userservice : UserService;

    constructor() {
        this.userservice = new UserService();
    }

    public async generateNonce(address: string) {
        address = address.toLowerCase();
        let user = await this.userservice.findByWalletAddress(address);
        const nonce = this.generateSignString(15);
      
        if (!user) {
            const userPayload = {
                username: await generateRandomUsername(),
                address: address,
            }
            await this.userservice.create(userPayload);
        } else {
            const id = user.get('id');
            await this.userservice.update(id as string, { nonce });
        }
      
        return { address, nonce };
    }
    
    public async signedSignIn(address : string, nonce : string, signature : string) {
        address = address.toLowerCase();
        const user = await this.userservice.findByWalletAddress(address);
        if (!user) {
            throw boom.notFound('User not found');
        }

        if (user.get('nonce') !== nonce) {
            throw boom.unauthorized('Invalid nonce');
        }

        const verifyAddress = verifyMessage(nonce, signature);
        const userAddress = user.get('address') as string;

        if (verifyAddress.toLowerCase() !== userAddress.toLowerCase()) {
            throw boom.unauthorized('Invalid signature');
        }

        const newNonce = this.generateSignString(15);
        const id = user.get('id');
        const updatedUser = await this.userservice.update(id as string, { nonce: newNonce });

        const tokenPayload = {
            id: updatedUser.get('id'),
            role: updatedUser.get('role'),
        }

        const token = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

        return { user: updatedUser, token: token };
    }

    public async autoSignIn(id: string) {
        const userRecord = await this.userservice.findById(id);
        if (!userRecord) {
            throw boom.notFound('User not found');
        }
        
        const tokenPayload = {
            id: userRecord.get('id'),
            role: userRecord.get('role'),
        }

        const freshToken = jwt.sign(tokenPayload, config.jwtSecret, { expiresIn: '7d' });

        return { user: userRecord, token: freshToken };
    }

    public generateSignString(length : number): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
        let sign = '';
      
        for (var i = 0; i < length; i++) {
          let randomPos = Math.floor(Math.random() * characters.length);
          sign += characters.charAt(randomPos);
        }
      
        return 'Sign this for security check ' + sign;
    }

}