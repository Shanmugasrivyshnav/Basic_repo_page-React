import "./language.css";

const LanguageFilterItem = (props) => {
  const { isActive, languageFilterDetails, updateActiveId } = props;
  const { id, language } = languageFilterDetails;
  const btnClassName = isActive
    ? "language-btn active-language-btn"
    : "language-btn";
  const onClickLanguageFilter = () => {
    updateActiveId(id);
  };

  return (
    <li>
      <button
        className={btnClassName}
        onClick={onClickLanguageFilter}
        type="button"
      >
        {language}
      </button>
    </li>
  );
};

export default LanguageFilterItem;
