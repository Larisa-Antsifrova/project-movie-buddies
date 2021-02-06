import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';

export default {
  changeName() {
    PNotify.success({
      text: 'Вы успешно сменили имя пользователя',
      delay: 3000,
    });
  },
  changeTelegramName() {
    PNotify.success({
      text: 'Ваш никнейм Telegram изменен',
      delay: 3000,
    });
  },
  changeEmail() {
    PNotify.success({
      text: 'Ваш Email был успешно изменен',
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
