import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || 'a-string-secret-at-least-256-bits-long'

export interface TokenPayload {
    userId: string,
    email: string
}

export function generateToken(payload: TokenPayload): string {
    return jwt.sign(
        payload,
        JWT_SECRET,
        {expiresIn: '30m'}
    )
}

export function generateRefreshToken(): string {
    return crypto.randomUUID()
}

export function verifyToken(token: string): TokenPayload{
    try{
        const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
        return decoded
    }catch(error){
        throw new Error('Invalid token')
    }
}