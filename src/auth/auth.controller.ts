import { Controller, Post, Body } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDTO, SignUpDTO } from "./dto";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('sign-in')
    signIn(@Body() dto: SignInDTO) {
        return this.authService.signIn(dto)
    }

    @Post('sign-up')
    signUp(@Body() dto: SignUpDTO) {
        return this.authService.signUp(dto)
    }
}