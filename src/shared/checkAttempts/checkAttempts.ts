import { maxAttempts } from "../consts/consts";

function checkAttempts(attempts: number) {
  return attempts > maxAttempts;
}

export { checkAttempts };
