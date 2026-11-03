/** Renders the simple article markup: blank-line separated paragraphs and "## " subheadings. */
export function ArticleBody({ body }: { body: string }) {
  const blocks = body.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
  return (
    <div className="prose">
      {blocks.map((b, i) => (b.startsWith('## ') ? <h2 key={i}>{b.slice(3)}</h2> : <p key={i}>{b}</p>))}
    </div>
  );
}
