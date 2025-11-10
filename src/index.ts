import app from "./app";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`firelocks-service listening on port ${port}`);
});
