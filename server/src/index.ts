import app from "./app";
import "./workers/receipt.worker";
import './workers/chat.worker';

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});