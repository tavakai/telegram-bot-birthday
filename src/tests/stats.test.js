const { updateStats } = require('../telegram/modules/messages/helpers');
const { User, Stickers, Animation } = require('../../db/models'); // ваши модели

describe('updateStats function', () => {
  let mockUser, mockSticker, mockAnimation;

  beforeEach(() => {
    // Моковые данные пользователя
    mockUser = { tg_user_id: 123, stickers_count: 0, msgs_count: 0, animations_count: 0, save: jest.fn() };

    // Моковые данные для стикеров
    mockSticker = { file_id: 'sticker123', send_count: 0, save: jest.fn() };

    // Моковые данные для анимации
    mockAnimation = { file_id: 'animation123', send_count: 0, save: jest.fn() };

    // Мокируем методы findOrCreate для каждой модели
    User.findOrCreate = jest.fn(() => [mockUser]);
    Stickers.findOrCreate = jest.fn(() => [mockSticker]);
    Animation.findOrCreate = jest.fn(() => [mockAnimation]);
  });

  test('should update statistics for a text message', async () => {
    const msg = {
      from: { id: 123, first_name: 'John', last_name: 'Doe' },
      text: 'Hello world!',
    };

    await updateStats(msg)

    // Ожидаем увеличение общего количества сообщений
    expect(mockUser.msgs_count).toBe(1);
    expect(mockUser.save).toHaveBeenCalled();
  });

  test('should update statistics for a sticker message', async () => {
    const msg = {
      from: { id: 123, first_name: 'John', last_name: 'Doe' },
      sticker: { file_id: 'sticker123' },
    };

    await updateStats(msg)

    // Ожидаем увеличение счетчика стикеров и сохранение данных пользователя и стикера
    expect(mockUser.stickers_count).toBe(1);
    expect(mockSticker.send_count).toBe(1);
    expect(mockUser.save).toHaveBeenCalled();
    expect(mockSticker.save).toHaveBeenCalled();
  });
});
