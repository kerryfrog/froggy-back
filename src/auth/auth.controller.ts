import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Request,
  Post,
  UseGuards,
  Patch,
  Delete,
  SerializeOptions,
  Query,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthForgotPasswordDto } from './dto/auth-forgot-password.dto';
import { AuthConfirmEmailDto } from './dto/auth-confirm-email.dto';
import { AuthResetPasswordDto } from './dto/auth-reset-password.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthGuard } from '@nestjs/passport';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import {
  AuthCheckIsExistEmailDto,
  AuthCheckIsExistEmailResDto,
} from './dto/auth-email-isExist.dto';
import { AuthRandomNickNameResDto } from './dto/auth-random-nickname.dto';
import { AuthSocialLoginResDto } from './dto/auth-social-login.dto';

@ApiTags('로컬 회원가입')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(public service: AuthService) {}

  @Post('email/register')
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 200, description: '회원가입 성공' })
  @ApiResponse({ status: 409, description: '이미 존재하는 이메일' })
  async register(@Body() createUserDto: AuthRegisterLoginDto) {
    return this.service.register(createUserDto);
  }

  @Post('email/login')
  @HttpCode(HttpStatus.OK)
  public async login(@Body() loginDto: AuthEmailLoginDto) {
    return this.service.validateLogin(loginDto);
  }

  @Get('email/isExist')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    description: '이미 존재하는 이메일: Y, 존재하지 않는 이메일:N ',
    type: AuthCheckIsExistEmailResDto,
  })
  public async checkIsEmailExist(
    @Body() checkEmailDto: AuthCheckIsExistEmailDto,
  ) {
    const checkResult = await this.service.checkExistEmail(checkEmailDto);
    const resJson = {
      isExistEmail: checkResult ? 'Y' : 'N',
    };
    return resJson;
  }

  @Get('random-nickname')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: 200,
    type: AuthRandomNickNameResDto,
    description: '랜덤 닉네임 조회 완료',
  })
  public async getRandomNickname(): Promise<AuthRandomNickNameResDto> {
    const nickname = await this.service.getUniqueNickName();
    const resJson = { nickname };
    return resJson;
  }

  @Get('social/login')
  @ApiResponse({
    status: 200,
    type: AuthSocialLoginResDto,
    description: '소셜 로그인 로그인 로직',
  })
  public async socialLogin(@Query('userId') userId) {
    const getAccessTokenAndUserByIdResult =
      await this.service.getAccessTokenAndUserById(userId);

    const { jwtToken, user } = getAccessTokenAndUserByIdResult;

    const resJson: AuthSocialLoginResDto = {
      jwtToken: jwtToken,
      user: user,
    };

    return resJson;
  }
  // @Post('email/confirm')
  // @HttpCode(HttpStatus.OK)
  // async confirmEmail(@Body() confirmEmailDto: AuthConfirmEmailDto) {
  //   return this.service.confirmEmail(confirmEmailDto.hash);
  // }

  // @Post('forgot/password')
  // @HttpCode(HttpStatus.OK)
  // async forgotPassword(@Body() forgotPasswordDto: AuthForgotPasswordDto) {
  //   return this.service.forgotPassword(forgotPasswordDto.email);
  // }

  // @Post('reset/password')
  // @HttpCode(HttpStatus.OK)
  // async resetPassword(@Body() resetPasswordDto: AuthResetPasswordDto) {
  //   return this.service.resetPassword(
  //     resetPasswordDto.hash,
  //     resetPasswordDto.password,
  //   );
  // }

  // @ApiBearerAuth()
  // @SerializeOptions({
  //   groups: ['me'],
  // })
  // @Get('me')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // public async me(@Request() request) {
  //   return this.service.me(request.user);
  // }

  // @ApiBearerAuth()
  // @SerializeOptions({
  //   groups: ['me'],
  // })
  // @Patch('me')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // public async update(@Request() request, @Body() userDto: AuthUpdateDto) {
  //   return this.service.update(request.user, userDto);
  // }

  // @ApiBearerAuth()
  // @Delete('me')
  // @UseGuards(AuthGuard('jwt'))
  // @HttpCode(HttpStatus.OK)
  // public async delete(@Request() request) {
  //   return this.service.softDelete(request.user);
  // }
}
