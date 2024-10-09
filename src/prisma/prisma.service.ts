import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor(){
        super({
            datasources:{
                db:{
                    url: 'mysql://root:1234@127.0.0.1:3306/engine?schema=public'
                }
            }
        })
    }
}
