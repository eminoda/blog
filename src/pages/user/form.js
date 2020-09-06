export const loginForm = {
  userName: {
    placeholder: '请输入用户名',
    decorator: [
      'userName',
      {
        rules: [
          {
            required: true,
            message: '请输入用户名',
          },
        ],
      },
    ],
  },
  password: {
    placeholder: '请输入密码',
    decorator: [
      'password',
      {
        rules: [
          {
            required: true,
            message: '请输入密码',
          },
        ],
      },
    ],
  },
};
