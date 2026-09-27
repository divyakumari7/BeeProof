class StateMachineService {
  constructor() {
    // Valid state transitions
    this.allowedTransitions = {
      'HARVESTED': ['COLLECTED', 'PROCESSING', 'ON_HOLD'],
      'COLLECTED': ['PROCESSING', 'ON_HOLD'],
      'PROCESSING': ['QUALITY_VERIFIED', 'ON_HOLD', 'REJECTED'],
      'QUALITY_VERIFIED': ['PACKAGED', 'ON_HOLD'],
      'PACKAGED': ['DISPATCHED', 'ON_HOLD'],
      'DISPATCHED': ['DELIVERED', 'ON_HOLD'],
      'DELIVERED': [],
      'ON_HOLD': ['HARVESTED', 'COLLECTED', 'PROCESSING', 'QUALITY_VERIFIED', 'PACKAGED', 'DISPATCHED'], // Only after integrity resolution
      'REJECTED': []
    };

    // Role permissions for state transitions
    this.rolePermissions = {
      'COLLECTED': ['PROCESSOR'],
      'PROCESSING': ['PROCESSOR'],
      'QUALITY_VERIFIED': ['QUALITY_LAB'],
      'REJECTED': ['QUALITY_LAB'],
      'ON_HOLD': ['QUALITY_LAB', 'ADMIN_KVIC', 'PROCESSOR'],
      'PACKAGED': ['PROCESSOR'],
      'DISPATCHED': ['DISTRIBUTOR'],
      'DELIVERED': ['DISTRIBUTOR']
    };
  }

  /**
   * Validate state transition and throw clear error if invalid
   */
  validateTransition(currentStatus, nextStatus, userRole) {
    if (currentStatus === 'ON_HOLD' && nextStatus !== 'ON_HOLD') {
      throw new Error('Batch is currently ON HOLD due to an integrity or quality issue. It cannot progress until resolved.');
    }

    const allowed = this.allowedTransitions[currentStatus] || [];
    if (!allowed.includes(nextStatus)) {
      throw new Error(`Invalid supply chain transition: Cannot change batch status from ${currentStatus} to ${nextStatus}. Progression must follow HARVESTED → COLLECTED → PROCESSING → QUALITY_VERIFIED → PACKAGED → DISPATCHED → DELIVERED.`);
    }

    const permittedRoles = this.rolePermissions[nextStatus];
    if (permittedRoles && !permittedRoles.includes(userRole) && userRole !== 'ADMIN_KVIC') {
      throw new Error(`Permission denied: Role ${userRole} is not authorized to transition batch to ${nextStatus}. Allowed roles: ${permittedRoles.join(', ')}.`);
    }

    return true;
  }
}

module.exports = new StateMachineService();
