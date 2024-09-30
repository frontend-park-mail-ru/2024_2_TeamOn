
# Компиляция hbs в js

TEMPLATES=(
  "../src/templates/homeTemplate.hbs"
  "../src/templates/profileTemplate.hbs"
  "../src/templates/loginTemplate.hbs"
  "../src/templates/signupTemplate.hbs"
)

OUTPUTS=(
  "../src/pages/home.precompiled.js"
  "../src/pages/profileView.precompiled.js"
  "../src/auth/loginView.precompiled.js"
  "../src/pages/signupView.precompiled.js"
)


for i in "${!TEMPLATES[@]}"; do
  handlebars "${TEMPLATES[i]}" -f "${OUTPUTS[i]}"
  echo "Скомпилирован: ${TEMPLATES[i]} -> ${OUTPUTS[i]}"
done
