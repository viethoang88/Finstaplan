import ChecklistItem from "./checklist-item";
import classes from "./checklist-group.module.css";
import { Divider } from "antd";

const ChecklistGroup = ({ section, sectionLabel, options }) => {
  return (
    <div className={classes.container}>
      <div className={classes.group_label}>{sectionLabel}</div>
      <div className={classes.checkboxes}>
        {options.map(({ question, selected, files, value }, idx) => (
          <div className={classes.checkbox_item}>
            <ChecklistItem
              question={question}
              selected={selected}
              files={files}
              key={idx}
              section={section}
              idx={idx}
              value={value}
            />
            <Divider />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChecklistGroup;
