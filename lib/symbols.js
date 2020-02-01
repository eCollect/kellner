'use strict';

module.exports = {
	kellnerRoute: Symbol('kellner:route'),
	kellnerApp: Symbol('kellner:app'),
	kellnerPipeline: Symbol('kellner:pipeline'),
	// Core - peudo private
	kellnerWires: Symbol('kellner:wires'),
	kellnerProcesses: Symbol('kellner:processes'),
	kellnerErrorStream: Symbol('kellner:errorstream'),
	kellnerLoggerManager: Symbol('kellner:loggerManager'),

	// Bus
	kellnerJobbus: Symbol('kellner:jobbus'),
	kellnerEventbus: Symbol('kellner:eventbus'),
	kellnerCommandbus: Symbol('kellner:commandbus'),
	kellnerNotificationbus: Symbol('kellner:notificatiobus'),
};
