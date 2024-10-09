import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SignInDTO, SignUpDTO } from './dto';
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) {}
    async signIn(dto: SignInDTO) {
        const user = await this.prisma.user.findUnique({
            where:{
                email: dto.email
            }
        });
        if (!user) throw new NotFoundException('User not found');
        const isMatchesPass = await argon.verify(user.hash, dto.password);
        if (!isMatchesPass) throw new ForbiddenException('Incorrect password');
        delete user.hash;
        delete user.phone;
        return user;
    }

    async signUp(dto: SignUpDTO) {
        try{
            const hash = await argon.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                    phone: dto.phone,

                    roleId: 2,
                    statusId: 1
                }
            });
            delete user.hash;
            delete user.phone;
            return user;
        }catch(error){
            if (error instanceof PrismaClientKnownRequestError && error.code ===  "P2002"){
                throw new ForbiddenException('User with that email already exists');
            }
            else{
                throw new InternalServerErrorException('Something is wrong. Try again later.');
            }
        }

    }
}
