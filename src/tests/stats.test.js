const { updateStats } = require('../telegram/modules/messages/helpers');
const { User, Stickers, Animation } = require('../../db/models'); // ваши модели

test('updateStats updates the user statistics correctly', async () => {
  // Моковые данные
  const msg = {
    from: { id: 123, first_name: 'John', last_name: 'Doe' },
    sticker: { file_id: 'sticker123' },
  };

  const mockUser = { tg_user_id: 123, stickers_count: 0, msgs_count: 0, save: jest.fn() };
  const mockSticker = { file_id: 'sticker123', send_count: 0, save: jest.fn() };

  User.findOrCreate = jest.fn(() => [mockUser]);
  Stickers.findOrCreate = jest.fn(() => [mockSticker]);

  await updateStats(msg);

  expect(mockUser.stickers_count).toBe(1);
  expect(mockSticker.send_count).toBe(1);
  expect(mockUser.save).toHaveBeenCalled();
  expect(mockSticker.save).toHaveBeenCalled();
});
