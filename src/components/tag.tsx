type TagProps = {
  children?: React.ReactNode;
  title?: string;
  color?: string;
  href?: string;
};

const Tag = (props: TagProps) => {
  const { title, color, children } = props;
  const currentColor = `text-${color} text-${color}/10 bg-${color}/10 border border-${color}/50`;

  return (
    <span
      title={title}
      className={`text-xs px-2 py-1 rounded-full text-center ${currentColor}`}
    >
      {"children" in props ? children : title}
    </span>
  );
};

export default Tag;
