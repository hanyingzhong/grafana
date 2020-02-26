import { cleanValue, findSelectedValue } from './utils';
import { SelectableOptGroup } from './types';
import { SelectableValue } from '@grafana/data';

const optGroup: SelectableOptGroup[] = [
  {
    label: 'Group 1',
    options: [
      { label: 'Group 1 - Option 1', value: 1 },
      { label: 'Group 1 - Option 2', value: 2 },
    ],
  },
  {
    label: 'Group 2',
    options: [
      { label: 'Group 2 - Option 1', value: 11 },
      { label: 'Group 2 - Option 2', value: 12 },
    ],
  },
  {
    label: 'Group 3',
    options: [
      { label: 'Group 4 - Option 1', value: 'test1' },
      { label: 'Group 4 - Option 2', value: 'test2' },
    ],
  },
  {
    label: 'Group 4',
    options: [
      { label: 'Group 4 - Option 1', value: 'test3' },
      { label: 'Group 4 - Option 2', value: 'test4' },
    ],
  },
];

const options: SelectableValue[] = [
  { label: 'Option 1', value: 1 },
  { label: ' Option 2', value: 'test2' },
  { label: 'Option 3', value: 3 },
  { label: 'Option 4', value: 4 },
  { label: 'Option 5', value: 'test5' },
  { label: 'Option 6', value: 6 },
];

describe('Forms.Select utils', () => {
  describe('findSelected value', () => {
    it('should find value of type number in array of optgroups', () => {
      expect(findSelectedValue(11, optGroup)).toEqual({ label: 'Group 2 - Option 1', value: 11 });
    });

    it('should find value of type string in array of optgroups', () => {
      expect(findSelectedValue('test3', optGroup)).toEqual({ label: 'Group 4 - Option 1', value: 'test3' });
    });

    it('should find the value of type number in array of options', () => {
      expect(findSelectedValue(3, options)).toEqual({ label: 'Option 3', value: 3 });
    });
    it('should find the value of type string in array of options', () => {
      expect(findSelectedValue('test5', options)).toEqual({ label: 'Option 5', value: 'test5' });
    });
  });
});
