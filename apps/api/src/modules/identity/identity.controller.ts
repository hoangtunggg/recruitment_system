import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { IdentityService } from './identity.service';
import { PublicRoute } from '../../platform/security/public-route.decorator';

class RegisterCandidateDto {
  @IsEmail() @MaxLength(320) email!: string;
  @IsString() password!: string;
}
class TokenDto {
  @IsString() @MinLength(20) token!: string;
}
class LoginDto extends RegisterCandidateDto {}
class RefreshDto {
  @IsString() @MinLength(20) refreshToken!: string;
}
class ResetConfirmationDto extends TokenDto {
  @IsString() password!: string;
}

@Controller('identity')
export class IdentityController {
  constructor(private readonly identity: IdentityService) {}
  @PublicRoute() @Post('registrations') async register(
    @Body() body: RegisterCandidateDto,
  ) {
    const value = await this.identity.registerCandidate(body);
    return { userId: value.userId };
  }
  @PublicRoute() @HttpCode(204) @Post('email-verifications') async verify(
    @Body() body: TokenDto,
  ) {
    await this.identity.verifyEmail(body);
  }
  @PublicRoute() @HttpCode(204) @Post('email-verifications/resend') async resend(
    @Body() body: Pick<RegisterCandidateDto, 'email'>,
  ) {
    await this.identity.resendVerification(body);
  }
  @PublicRoute() @Post('sessions') async login(@Body() body: LoginDto) {
    return this.identity.login(body);
  }
  @PublicRoute() @Post('sessions/refresh') async refresh(@Body() body: RefreshDto) {
    return this.identity.refresh({ refreshToken: body.refreshToken });
  }
  @PublicRoute() @HttpCode(204) @Post('password-resets') async requestReset(
    @Body() body: Pick<RegisterCandidateDto, 'email'>,
  ) {
    await this.identity.requestPasswordReset(body);
  }
  @PublicRoute() @HttpCode(204) @Post('password-resets/confirm') async confirmReset(
    @Body() body: ResetConfirmationDto,
  ) {
    await this.identity.confirmPasswordReset({
      token: body.token,
      password: body.password,
    });
  }
}
