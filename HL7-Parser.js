let defaultOptions = {
  SegmentSeparator: '\n',
  FieldSeparator: '|',
  ComponentSeparator: '^',
  FieldRepeatSeparator: '~',
  EscapeCharacter: '\\',
  SubcomponentSeparator: '&',
}

const parseSubcomponent = (subcomponent) => {
  let result = [];
  let subcomponents = subcomponent.split(defaultOptions.SubcomponentSeparator);

  if (subcomponents.length === 1) {
    result = subcomponents[0];

  } else {
    subcomponents.map(subcomp => {
      result.push(subcomp)
    })
  }

  return result;
}

const parseRepeatField = (field) => {
  let result = [];
  let repeats = field.split(defaultOptions.ComponentSeparator)

  repeats.map(repeat => {
    if (repeats.length === 1) {
      result = repeat
    } else {
      result.push(parseSubcomponent(repeat))
    }
  })

  return result;
}

const parseRepeat = (repeatingField) => {
  let result = [];
  let components = repeatingField.split(defaultOptions.FieldRepeatSeparator);

  components.map(childField => {
    if (components.length === 1) {
      result = parseRepeatField(childField)
    } else {
      result.push(parseRepeatField(childField))
    }
  })

  return result;
}

const parseSegment = (segment) => {
  let result = []
  let fields = segment.split(defaultOptions.FieldSeparator);

  let start = 1;

  if (fields[0] === 'MSH') {
    start = 2;

    result.push(fields[0])
    result.push(defaultOptions.FieldSeparator)
    result.push(fields[1])
  } else {
    result.push(fields[0])
  }

  fields.map((field, index) => {
    if (index >= start) {
      result.push(parseRepeat(field))
    }
  })

  return result;
}

const parseSegments = (data) => {
  let segments = data.split(defaultOptions.SegmentSeparator).map(segment => segment.trim()).filter(segment => segment !== '');

  const result = segments.map((segment, index) => parseSegment(segment))

  return result
}

const parseHL7 = (data = '', options = {}) => {
  if (typeof (data) !== 'string')
    return null;

  defaultOptions = { ...defaultOptions, ...options };

  return parseSegments(data);
}

export default parseHL7