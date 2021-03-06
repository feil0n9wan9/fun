'use strict';

const expect = require('expect.js');

const definition = require('../lib/definition');

const tpl = {
  'ROSTemplateFormatVersion': '2015-09-01',
  'Transform': 'Aliyun::Serverless-2018-04-03',
  'Resources': {
    'localdemo': {
      'Type': 'Aliyun::Serverless::Service',
      'Properties': {
        'Description': 'php local invoke demo'
      },
      'python3': {
        'Type': 'Aliyun::Serverless::Function',
        'Properties': {
          'Handler': 'index.handler',
          'CodeUri': 'python3',
          'Description': 'Hello world with python3!',
          'Runtime': 'python3'
        }
      },
    }
  }
};

const tplWithDuplicatedFunction = {
  'ROSTemplateFormatVersion': '2015-09-01',
  'Transform': 'Aliyun::Serverless-2018-04-03',
  'Resources': {
    'localdemo': {
      'Type': 'Aliyun::Serverless::Service',
      'Properties': {
        'Description': 'php local invoke demo'
      },
      'python3': {
        'Type': 'Aliyun::Serverless::Function',
        'Properties': {
          'Handler': 'index.handler',
          'CodeUri': 'python3',
          'Description': 'Hello world with python3!',
          'Runtime': 'python3'
        }
      },
    },
    'localdemo2': {
      'Type': 'Aliyun::Serverless::Service',
      'Properties': {
        'Description': 'php local invoke demo'
      },
      'python3': {
        'Type': 'Aliyun::Serverless::Function',
        'Properties': {
          'Handler': 'index.handler2',
          'CodeUri': 'python3',
          'Description': 'Hello world with python3 2!',
          'Runtime': 'python3'
        }
      },
    }
  }
};

describe('test findFunctionByServiceAndFunctionName', () => {
  it('test find by service name and funtion name', () => {

    const [serviceName, functionName, functionDefinition] = definition.findFunctionInTpl('localdemo', 'python3', tpl);

    expect(serviceName).to.be('localdemo');
    expect(functionName).to.be('python3');

    expect(functionDefinition).to.eql(tpl.Resources.localdemo.python3);
  });

  it('test find by funtion name', async function () {

    const [serviceName, functionName, functionDefinition] = definition.findFunctionInTpl(null, 'python3', tpl);

    expect(serviceName).to.be('localdemo');
    expect(functionName).to.be('python3');
    expect(functionDefinition).to.eql(tpl.Resources.localdemo.python3);
  });

  it('test find not found', async function () {

    const [serviceName, functionName, functionDefinition] = definition.findFunctionInTpl(null, 'python4', tpl);

    expect(serviceName).to.be(null);
    expect(functionName).to.be(null);
    expect(functionDefinition).to.eql(null);
  });

  it('test find by service name and function name in duplicated function', async function () {

    let [serviceName, functionName, functionDefinition] = definition.findFunctionInTpl('localdemo', 'python3', tplWithDuplicatedFunction);

    expect(serviceName).to.be('localdemo');
    expect(functionName).to.be('python3');
    expect(functionDefinition).to.eql(tplWithDuplicatedFunction.Resources.localdemo.python3);
    
    [serviceName, functionName, functionDefinition] = definition.findFunctionInTpl('localdemo2', 'python3', tplWithDuplicatedFunction);

    expect(serviceName).to.be('localdemo2');
    expect(functionName).to.be('python3');
    expect(functionDefinition).to.eql(tplWithDuplicatedFunction.Resources.localdemo2.python3);
  });

  it('test find by function name in duplicated function', async function () {

    let [serviceName, functionName, functionDefinition] = definition.findFunctionInTpl(null, 'python3', tplWithDuplicatedFunction);

    expect(serviceName).to.be('localdemo');
    expect(functionName).to.be('python3');
    expect(functionDefinition).to.eql(tplWithDuplicatedFunction.Resources.localdemo.python3);
  });
});