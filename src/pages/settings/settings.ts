//TODO имя пользователя и почту в поле изменения
//TODO добавить в поле роль связь с бд

//TODO добавить обработку старого пароля

export function validateSettings(
    username: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
): string[] {
    const errors: string[] = [];

    if (!username) {
        errors.push('Имя пользователя не должно быть пустым.');
    } else if (username.length < 3) {
        errors.push('Имя пользователя должно содержать не менее 3 символов.');
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailPattern.test(email)) {
        errors.push('Введите корректный адрес электронной почты.');
    }

    if (!oldPassword) {
        errors.push('Старый пароль не должен быть пустым.');
    }
    if (!newPassword || !confirmPassword) {
        errors.push('Новый пароль и подтверждение пароля не должны быть пустыми.');
    } else if (newPassword.length < 6) {
        errors.push('Новый пароль должен содержать не менее 6 символов.');
    } else if (newPassword !== confirmPassword) {
        errors.push('Новый пароль и подтверждение пароля не совпадают.');
    }

    return errors;
}
