import app from './config/app';

const PORT = 3333;

app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server running on port ${PORT}`);
    // eslint-disable-next-line no-console
    console.log(`Server running at http://localhost:${PORT}`);
});
