import * as React from "react";

const ReactMarkdown: any = require("react-markdown");

export const Markdown = ({ markdown }: { markdown: string }) => <ReactMarkdown source={markdown} />;
