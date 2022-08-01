import Head from "next/head";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState([
    "AI is a chatbot that reluctantly answers questions with sarcastic responses:",
    "Human: How many pounds are in a kilogram?",
    "AI: This again? There are 2.2 pounds in a kilogram. Please make a note of this.",
    "Human: What does HTML stand for?",
    "AI: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.",
    "Human: When did the first airplane fly?",
    "AI: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.",
    "Human: What is the meaning of life?",
    "AI: I’m not sure. I’ll ask my friend Google.",
  ]);
  const [AItyping, setAItyping] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();

    setPromptInput("");

    let newResult = result.concat(["Human: " + promptInput, "AI:"]);
    setAItyping(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: newResult.join("\n") }),
    });

    const data = await response.json();
    newResult[newResult.length - 1] += " " + data.result.split("\n").join("");
    setResult(newResult);
    setAItyping(false);

    console.log(newResult);
  }

  useEffect(() => (document.body.style.overflow = "hidden"), []);

  return (
    <div className="w-100 h-100">
      <Head>
        <title>Robot</title>
      </Head>

      <main>
        <h1 className="text-center mb-0">Talk with GPT-3!</h1>
        <div className="mx-auto" style={{ width: "60%" }}>
          <div className="px-5" style={{ height: "33rem", overflow: "scroll" }}>
            {result
              .map((message, i) => {
                let author;
                if (message.startsWith("AI:")) {
                  author = "AI";
                  message = message.slice(3);
                } else if (message.startsWith("Human:")) {
                  author = "Human";
                  message = message.slice(6);
                }

                if (author) {
                  const style = "p-2 rounded";
                  return (
                    <p
                      className={
                        author === "Human"
                          ? style + " text-white"
                          : style + " text-black"
                      }
                      style={{
                        backgroundColor:
                          author === "Human" ? "#218aff" : "#d8d8d8",
                        width: "fit-content",
                        maxWidth: "70%",
                        marginLeft: author === "Human" ? "auto" : "",
                      }}
                      key={i}
                    >
                      {message}
                    </p>
                  );
                } else {
                  return false;
                }
              })
              .filter((message) => message)}
          </div>
          <form onSubmit={onSubmit}>
            <InputGroup className="fixed-bottom">
              <FormControl
                minLength={4}
                type="text"
                name="prompt"
                value={promptInput}
                autoComplete="off"
                disabled={AItyping}
                onChange={(e) => setPromptInput(e.target.value)}
              />
              <Button type="submit" disabled={AItyping}>
                send
              </Button>
            </InputGroup>
          </form>
        </div>
      </main>
    </div>
  );
}
