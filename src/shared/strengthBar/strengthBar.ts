function updatePasswordStrengthBar(strength: number) {
  const strengthBar: any = document.querySelector(".password-strength");
  const strengthPercentage = (strength / 5) * 100; // 5 - максимальное количество критериев

  // Установка ширины и цвета в зависимости от силы пароля
  strengthBar.style.width = strengthPercentage + "%";
  if (strengthPercentage == 0) {
    strengthBar.style.width = "10%";
  }
  // Изменение цвета в зависимости от силы пароля
  if (strengthPercentage <= 40) {
    strengthBar.style.backgroundColor = "red";
  } else if (strengthPercentage < 80) {
    strengthBar.style.backgroundColor = "yellow";
  } else {
    strengthBar.style.backgroundColor = "green";
  }
}

export { updatePasswordStrengthBar };
