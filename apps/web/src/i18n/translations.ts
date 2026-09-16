export type Language = 'en' | 'pt-BR'

export const LANGUAGES: Language[] = ['en', 'pt-BR']

export interface Translations {
  nav: {
    dashboard: string
    transactions: string
    budgets: string
    investments: string
    planner: string
    goals: string
    market: string
  }
  common: {
    cancel: string
    delete: string
    save: string
    add: string
    comingSoon: string
  }
  transactions: {
    title: string
    addTransaction: string
    editTransaction: string
    income: string
    expenses: string
    balance: string
    allTypes: string
    allCategories: string
    fromDate: string
    toDate: string
    search: string
    loading: string
    loadError: string
    empty: string
    columnDate: string
    columnDescription: string
    columnCategory: string
    columnAmount: string
    edit: string
    delete: string
    deleteTitle: string
    deleteMessage: (description: string) => string
    saveChanges: string
    add: string
    typeExpense: string
    typeIncome: string
    amount: string
    description: string
    date: string
    category: string
    selectCategory: string
    notesOptional: string
  }
  categories: {
    title: string
    income: string
    expense: string
    newCategoryName: string
    deleteTitle: string
    deleteMessage: (name: string) => string
  }
  budgets: {
    title: string
    addBudget: string
    editBudget: string
    previousMonth: string
    nextMonth: string
    spent: string
    limit: string
    remaining: string
    overspent: string
    empty: string
    loading: string
    loadError: string
    category: string
    selectCategory: string
    noCategoriesLeft: string
    deleteTitle: string
    deleteMessage: (categoryName: string) => string
  }
}

export const translations: Record<Language, Translations> = {
  en: {
    nav: {
      dashboard: 'Dashboard',
      transactions: 'Transactions',
      budgets: 'Budgets',
      investments: 'Investments',
      planner: 'Planner',
      goals: 'Goals',
      market: 'Market',
    },
    common: {
      cancel: 'Cancel',
      delete: 'Delete',
      save: 'Save',
      add: 'Add',
      comingSoon: 'Coming in a later phase.',
    },
    transactions: {
      title: 'Transactions',
      addTransaction: 'Add transaction',
      editTransaction: 'Edit transaction',
      income: 'Income',
      expenses: 'Expenses',
      balance: 'Balance',
      allTypes: 'All types',
      allCategories: 'All categories',
      fromDate: 'From date',
      toDate: 'To date',
      search: 'Search description or notes',
      loading: 'Loading transactions…',
      loadError: 'Failed to load transactions.',
      empty: 'No transactions match these filters yet.',
      columnDate: 'Date',
      columnDescription: 'Description',
      columnCategory: 'Category',
      columnAmount: 'Amount',
      edit: 'Edit',
      delete: 'Delete',
      deleteTitle: 'Delete transaction',
      deleteMessage: (description) => `Delete "${description}"? This cannot be undone.`,
      saveChanges: 'Save changes',
      add: 'Add transaction',
      typeExpense: 'Expense',
      typeIncome: 'Income',
      amount: 'Amount',
      description: 'Description',
      date: 'Date',
      category: 'Category',
      selectCategory: 'Select a category',
      notesOptional: 'Notes (optional)',
    },
    categories: {
      title: 'Categories',
      income: 'Income',
      expense: 'Expense',
      newCategoryName: 'New category name',
      deleteTitle: 'Delete category',
      deleteMessage: (name) =>
        `Delete "${name}"? This only works if no transactions or budgets use it.`,
    },
    budgets: {
      title: 'Budgets',
      addBudget: 'Add budget',
      editBudget: 'Edit budget',
      previousMonth: 'Previous month',
      nextMonth: 'Next month',
      spent: 'Spent',
      limit: 'Limit',
      remaining: 'Remaining',
      overspent: 'Over budget',
      empty: 'No budgets set for this month yet.',
      loading: 'Loading budgets…',
      loadError: 'Failed to load budgets.',
      category: 'Category',
      selectCategory: 'Select a category',
      noCategoriesLeft: 'Every expense category already has a budget this month.',
      deleteTitle: 'Delete budget',
      deleteMessage: (categoryName) => `Delete the budget for "${categoryName}"?`,
    },
  },
  'pt-BR': {
    nav: {
      dashboard: 'Painel',
      transactions: 'Transações',
      budgets: 'Orçamentos',
      investments: 'Investimentos',
      planner: 'Planejador',
      goals: 'Metas',
      market: 'Mercado',
    },
    common: {
      cancel: 'Cancelar',
      delete: 'Excluir',
      save: 'Salvar',
      add: 'Adicionar',
      comingSoon: 'Disponível em uma fase futura.',
    },
    transactions: {
      title: 'Transações',
      addTransaction: 'Adicionar transação',
      editTransaction: 'Editar transação',
      income: 'Receitas',
      expenses: 'Despesas',
      balance: 'Saldo',
      allTypes: 'Todos os tipos',
      allCategories: 'Todas as categorias',
      fromDate: 'Data inicial',
      toDate: 'Data final',
      search: 'Buscar descrição ou notas',
      loading: 'Carregando transações…',
      loadError: 'Falha ao carregar transações.',
      empty: 'Nenhuma transação corresponde a esses filtros ainda.',
      columnDate: 'Data',
      columnDescription: 'Descrição',
      columnCategory: 'Categoria',
      columnAmount: 'Valor',
      edit: 'Editar',
      delete: 'Excluir',
      deleteTitle: 'Excluir transação',
      deleteMessage: (description) => `Excluir "${description}"? Isso não pode ser desfeito.`,
      saveChanges: 'Salvar alterações',
      add: 'Adicionar transação',
      typeExpense: 'Despesa',
      typeIncome: 'Receita',
      amount: 'Valor',
      description: 'Descrição',
      date: 'Data',
      category: 'Categoria',
      selectCategory: 'Selecione uma categoria',
      notesOptional: 'Notas (opcional)',
    },
    categories: {
      title: 'Categorias',
      income: 'Receita',
      expense: 'Despesa',
      newCategoryName: 'Nome da nova categoria',
      deleteTitle: 'Excluir categoria',
      deleteMessage: (name) =>
        `Excluir "${name}"? Isso só funciona se nenhuma transação ou orçamento a utilizar.`,
    },
    budgets: {
      title: 'Orçamentos',
      addBudget: 'Adicionar orçamento',
      editBudget: 'Editar orçamento',
      previousMonth: 'Mês anterior',
      nextMonth: 'Próximo mês',
      spent: 'Gasto',
      limit: 'Limite',
      remaining: 'Restante',
      overspent: 'Acima do orçamento',
      empty: 'Nenhum orçamento definido para este mês ainda.',
      loading: 'Carregando orçamentos…',
      loadError: 'Falha ao carregar orçamentos.',
      category: 'Categoria',
      selectCategory: 'Selecione uma categoria',
      noCategoriesLeft: 'Todas as categorias de despesa já têm orçamento este mês.',
      deleteTitle: 'Excluir orçamento',
      deleteMessage: (categoryName) => `Excluir o orçamento de "${categoryName}"?`,
    },
  },
}
