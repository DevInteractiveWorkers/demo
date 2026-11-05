type TagProps = {
  children?: React.ReactNode;
  title?: string;
  color?: string;
  href?: string;
};

const Tag = (props: TagProps) => {
  const { title, color, children } = props;

  return (
    <span
      title={title}
      className={`text-xs px-2 py-1 rounded-full text-center border flex items-center justify-center whitespace-nowrap`}
      style={{
        color,
        backgroundColor: `${color}10`,
      }}
    >
      {"children" in props ? children : title}
    </span>
  );
};

export default Tag;
