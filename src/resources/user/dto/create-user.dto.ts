import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'El campo de nombre es obligatorio' })
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'El nombre de usuario solo puede contener letras y números.',
  })
  @MaxLength(24, { message: 'El nombre no debe exceder los 24 caracteres.' })
  @Matches(/^\S*$/, {
    message: 'El nombre de usuario no puede contener espacios en blanco.',
  })
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'El campo de la contrasña es obligatorio' })
  @Matches(/^[^'"<>]*$/, {
    message: 'La contraseña no puede contener los caracteres \', ", < o >.',
  })
  @Matches(/^\S*$/, {
    message: 'La contraseña no puede contener espacios en blanco.',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*[^a-zA-Z0-9]).+$/, {
    message:
      'La contraseña debe tener al menos un número, una letra mayúscula, un carácter no alfanumérico. ',
  })
  @MinLength(6, {
    message: 'La contraseña debe contener entre 6 y 16 caracteres.',
  })
  @MaxLength(16, {
    message: 'La contraseña debe contener entre 6 y 16 caracteres.',
  })
  password: string;
}
