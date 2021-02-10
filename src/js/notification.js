import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';

export default {
  changeName() {
    PNotify.success({
      text: "Hey! You've changed your name!",
      delay: 3000,
    });
  },
  changeTelegramName() {
    PNotify.success({
      text: "You've updated your Telegram nickname!",
      delay: 3000,
    });
  },
  changeEmail() {
    PNotify.success({
      text: "Hey! You've just updated your e-mail!",
      delay: 3000,
    });
  },

  error(textContent) {
    PNotify.error({
      text: textContent,
      delay: 3000,
    });
  },
};
