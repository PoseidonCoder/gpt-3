import Head from "next/head";
import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [promptInput, setPromptInput] = useState("");
  const [result, setResult] = useState([]);
  const [AItyping, setAItyping] = useState(false);
  const chat = useRef(null);

  async function onSubmit(event) {
    event.preventDefault();

    setPromptInput("");

    let newResult = result.concat(["Human: " + promptInput, "LaMDA:"]);
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
    chat.current.scrollTop = chat.current.scrollHeight;

    console.log(newResult);
  }

  useEffect(() => (document.body.style.overflow = "hidden"), []);

  return (
    <div className="w-100 h-100">
      <Head>
        <title>GPT-3-CHAT</title>
      </Head>

      <main>
        <h1 className="text-center mb-0">Talk with GPT-3!</h1>
        <div className="mx-auto" style={{ width: "60%" }}>
          <div
            className="px-5"
            style={{ height: "33rem", overflow: "scroll" }}
            ref={chat}
          >
            {result
              .map((message, i) => {
                let author;
                if (message.startsWith("LaMDA:")) {
                  author = "LaMDA";
                  message = message.slice(6);
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
