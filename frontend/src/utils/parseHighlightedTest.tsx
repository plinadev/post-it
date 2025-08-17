export const parseHighlightedText = (text: string) => {
  const parts = text.split(/(<bold>|<\/bold>)/g); // split by tags
  return parts.map((part, i) => {
    if (part === "<bold>") return null;
    if (part === "</bold>") return null;
    // If previous part was <bold>, render bold
    const isBold = parts[i - 1] === "<bold>";
    return (
      <span key={i} className={isBold ? "font-bold" : ""}>
        {part}
      </span>
    );
  });
};
