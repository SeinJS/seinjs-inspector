/**
 * @File   : Game.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 7/28/2019, 3:55:56 PM
 * @Description:
 */
import { h, Component } from "preact";
import "./index.scss";

interface IComponentProps {
  label?: string;
  onSelectChange: Function;
  options: Array<{
    text: string;
    value: string | number;
    selected?: boolean;
  }>;
}

interface IComponentState {}

export default class Select extends Component<IComponentProps, IComponentState> {
  private selectChange = event => {
    const { onSelectChange } = this.props;
    onSelectChange(event.target.value);
  }

  public render() {
    let { label, options } = this.props;
    label = label || "Label";

    return (
      <div className="sein-inspector-component sein-inspector-select-container">
        <div className="sein-inspector-component-box">
          <label className="sein-inspector-label" title={label}>
            {label}
          </label>
          <select
            className="sein-inspector-select"
            onChange={this.selectChange}
          >
            {options.map(item => {
              return (
                <option
                  value={item.value}
                  title={item.text}
                  selected={item.selected}
                >
                  {item.text}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    );
  }
}
