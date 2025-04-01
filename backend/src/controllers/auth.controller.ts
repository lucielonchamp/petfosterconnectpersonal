export async function register(req, res) {
  console.log('register');
  res.status(200).json({ success: true, message: 'Youpi !' })
};